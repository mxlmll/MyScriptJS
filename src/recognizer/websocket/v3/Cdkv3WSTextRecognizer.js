import { recognizerLogger as logger } from '../../../configuration/LoggerConfig';
import * as CryptoHelper from '../../CryptoHelper';
import Constants from '../../../configuration/Constants';
import * as InkModel from '../../../model/InkModel';
import * as RecognizerContext from '../../../model/RecognizerContext';
import * as StrokeComponent from '../../../model/StrokeComponent';
import * as Cdkv3WSWebsocketBuilder from './Cdkv3WSBuilder';
import * as CdkWSRecognizerUtil from '../CdkWSRecognizerUtil';
import * as Cdkv3CommonTextRecognizer from '../../common/v3/Cdkv3CommonTextRecognizer';
import * as DefaultRecognizer from '../../DefaultRecognizer';

export { close } from '../CdkWSRecognizerUtil';

/**
 * Recognizer configuration
 * @type {RecognizerInfo}
 */
export const textWebSocketV3Configuration = {
  types: [Constants.RecognitionType.TEXT],
  protocol: Constants.Protocol.WEBSOCKET,
  apiVersion: 'V3',
  availableTriggers: {
    exportContent: [Constants.Trigger.POINTER_UP]
  }
};

/**
 * Get the configuration supported by this recognizer
 * @return {RecognizerInfo}
 */
export function getInfo() {
  return textWebSocketV3Configuration;
}

function buildHmacMessage(recognizerContext, message, configuration) {
  return {
    type: 'hmac',
    applicationKey: configuration.recognitionParams.server.applicationKey,
    challenge: message.data.challenge,
    hmac: CryptoHelper.computeHmac(message.data.challenge, configuration.recognitionParams.server.applicationKey, configuration.recognitionParams.server.hmacKey)
  };
}

function buildInitMessage(recognizerContext, model, configuration) {
  return {
    type: 'applicationKey',
    applicationKey: configuration.recognitionParams.server.applicationKey
  };
}

function buildTextInput(recognizerContext, model, configuration) {
  if (recognizerContext.lastPositions.lastSentPosition < 0) {
    return {
      type: 'start',
      textParameter: configuration.recognitionParams.v3.textParameter,
      inputUnits: [{
        textInputType: 'MULTI_LINE_TEXT',
        components: model.rawStrokes.map(stroke => StrokeComponent.toJSON(stroke))
      }]
    };
  }

  return {
    type: 'continue',
    inputUnits: [{
      textInputType: 'MULTI_LINE_TEXT',
      components: InkModel.extractPendingStrokes(model, -1).map(stroke => StrokeComponent.toJSON(stroke))
    }]
  };
}

function buildResetMessage(recognizerContext, model, configuration) {
  return {
    type: 'reset'
  };
}

function resultCallback(model) {
  logger.debug('Cdkv3WSTextRecognizer result callback', model);
  const modelReference = model;
  modelReference.exports = Cdkv3CommonTextRecognizer.extractExports(model);
  logger.debug('Cdkv3WSTextRecognizer model updated', modelReference);
  return modelReference;
}

/**
 * Initialize recognition
 * @param {Configuration} configuration Current configuration
 * @param {Model} model Current model
 * @param {RecognizerContext} recognizerContext Current recognizer context
 * @param {function(err: Object, res: Object)} callback
 */
export function init(configuration, model, recognizerContext, callback) {
  const initContext = {
    suffixUrl: '/api/v3.0/recognition/ws/text',
    buildWebSocketCallback: Cdkv3WSWebsocketBuilder.buildWebSocketCallback,
    buildInitMessage,
    buildHmacMessage,
    reconnect: init,
    model,
    configuration,
    callback
  };

  CdkWSRecognizerUtil.init(configuration, InkModel.resetModelPositions(model), recognizerContext, initContext)
    .then(res => callback(undefined, res))
    .catch((err) => {
      if (RecognizerContext.shouldAttemptImmediateReconnect(recognizerContext) && recognizerContext.reconnect) {
        logger.info('Attempting a reconnect', recognizerContext.currentReconnectionCount);
        recognizerContext.reconnect(configuration, model, recognizerContext, callback);
      } else {
        logger.error('Unable to init', err);
        callback(err, model);
      }
    });
}

/**
 * Export content
 * @param {Configuration} configuration Current configuration
 * @param {Model} model Current model
 * @param {RecognizerContext} recognizerContext Current recognizer context
 * @param {function(err: Object, res: Object)} callback
 */
export function exportContent(configuration, model, recognizerContext, callback) {
  CdkWSRecognizerUtil.sendMessages(configuration, InkModel.updateModelSentPosition(model), recognizerContext, (err, res) => callback(err, resultCallback(res)), buildTextInput);
}

/**
 * Reset the recognition context
 * @param {Configuration} configuration Current configuration
 * @param {Model} model Current model
 * @param {RecognizerContext} recognizerContext Current recognizer context
 * @param {function(err: Object, res: Object)} callback
 */
export function reset(configuration, model, recognizerContext, callback) {
  CdkWSRecognizerUtil.sendMessages(configuration, InkModel.resetModelPositions(model), recognizerContext, (err, res) => callback(err, resultCallback(res)), buildResetMessage);
}

/**
 * Clear server context. Currently nothing to do there.
 * @param {Configuration} configuration Current configuration
 * @param {Model} model Current model
 * @param {RecognizerContext} recognizerContext Current recognizer context
 * @param {function(err: Object, res: Object)} callback
 */
export function clear(configuration, model, recognizerContext, callback) {
  DefaultRecognizer.clear(configuration, model, recognizerContext, (err, res) => {
    reset(configuration, res, recognizerContext, (err1, res1) => logger.trace('Session reset'));
    callback(err, res);
  });
}
