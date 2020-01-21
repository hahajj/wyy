import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response =>
        response.json().then(json => {
            if (response.status < 200 || response.status > 300) {
                return Promise.reject(json);
                if(response.status===401){
                }
            }

            return json;
        })
    );
};

export function getDevices() {
    return request({
        url: API_BASE_URL + "/api/devices",
        method: 'GET'
    });
}
export function getCameras(sn) {
    var url=sn+"/cameras"
    return request({
        url: API_BASE_URL + "/api/devices/"+url,
        method: 'GET'
    });
}
export function getRtmpOne(sn,id) {
    return request({
        url: API_BASE_URL + "/api/devices/rtmpOne/"+sn+"/"+id,
        method: 'GET'
    });
}


export function getprom() {
    return request({
        url: 'http://192.168.18.162:3001/gettoken?appkey=dingjzxtohvqexxzo98s&appsecret=ve70uyaBZVwBYAppBrrf9ay2BIQ0qcTZ6snetubc3nYy_fcN1cZ8_2ay_TIo6SjJ',
        method: 'GET'
    });
}


export function getRtmp(sn) {
    return request({
        url: API_BASE_URL + "/api/devices/rtmp/"+sn,
        method: 'GET'
    });
}
export function changeCamera(data) {
    var uri='/'+data.sn+'/'+data.id+'/'+data.name
    return request({
        url: API_BASE_URL + "/api/devices/changeCameraName"+uri,
        method: 'get',
    });
}
export function changeCameraNames(data) {
    return request({
        url: API_BASE_URL + "/api/devices/changeCameraNames",
        method: 'post',
        body: JSON.stringify(data)
    });
}



export function getLives(sn,cameraId) {
    return request({
        url: API_BASE_URL + "/api/devices/rtmp/"+sn+"/"+cameraId,
        method: 'GET'
    });
}


export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'post',
        body: loginRequest
    });
}

