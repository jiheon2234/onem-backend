/// <reference types="k6" />

import http from 'k6/http';
import {check} from 'k6';

const BASE_URL = 'my-app:8080';

export const options = {
    scenarios: {
        ramp_rpm: {
            executor: 'ramping-arrival-rate',
            timeUnit: '1s',
            startRate: 10000,
            preAllocatedVUs: 50,
            maxVUs: 500,
            stages: [
                {target: 5, duration: '20s'},
                {target: 10, duration: '20s'},
                {target: 15, duration: '20s'},
                {target: 20, duration: '20s'},
                {target: 25, duration: '20s'},
                {target: 30, duration: '20s'},
                {target: 35, duration: '10s'},
            ],
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'],
    },
};


// /**
//  * @type {import("k6/options").Options}
//  */
// export const options = {
//     scenarios: {
//         find_limit: {
//             executor: 'ramping-vus',
//             startVUs: 0,
//             stages: [
//                 {duration: '30s', target: 50},
//                 {duration: '30s', target: 100},
//                 {duration: '30s', target: 200},
//                 {duration: '30s', target: 300},
//                 {duration: '30s', target: 400},
//                 {duration: '30s', target: 500},
//                 {duration: '30s', target: 0},
//             ],
//         },
//     },
//     thresholds: {
//         http_req_duration: ['p(95)<500'],
//     }
// };


export default function () {
    const data = {originUrl: "https://google.com", "ttlMinutes": 100}
    const res = http.post(`http://${BASE_URL}/shorten-url`, JSON.stringify(data), {
        headers: {'Content-Type': 'application/json'},
    });

    check(res, {
        'is status 200': (r) => r.status === 200,
    })
    const shortenedUrl = JSON.parse(res.body).shortenedUrl;


    const origin_res = http.get(`http://${BASE_URL}/shorten-url/${shortenedUrl}`)
    // console.log(`shortenedUrl=${shortenedUrl},originUrl=${(JSON.parse(origin_res.body).originUrl)}`);

    check(origin_res, {
        'is status 200': (r) => r.status === 200,
    })
}