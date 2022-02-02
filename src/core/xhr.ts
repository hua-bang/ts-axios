import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import { parseHeaders } from '../helpers/headers';
import { createError } from '../helpers/error';
import { HTTP_STATUS_ENUM } from '../const/index';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config;

    const request = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType;
    }

    request.open(method.toUpperCase(), url, true);

    // you can visit `https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/onreadystatechange` to learn this api
    request.onreadystatechange = () => {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData = responseType !== 'text' ? request.response : request.responseText;
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      handleResponse(response);
    };

    function handleResponse(response: AxiosResponse) {
      const { status } = response;
      if (status >= HTTP_STATUS_ENUM.SUCCESS && status < HTTP_STATUS_ENUM.REDIRECTION) {
        resolve(response);
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        );
      }
    }

    request.onerror = () => {
      reject(createError('Network error', config, null, request));
    };

    if (timeout) {
      request.timeout = timeout;
    }

    // handle request timeout
    request.ontimeout = () => {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request));
    };

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name];
      }
      request.setRequestHeader(name, headers[name]);
    });

    request.send(data);
  });
}
