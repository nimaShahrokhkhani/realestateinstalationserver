var express = require('express');
var router = express.Router();
var db = require('../../helper/db');
const fs = require('fs');
const getUuid = require('uuid-by-string');

router.get('/list', function (request, response, next) {
    let filterData = {
        deviceId: request.query.deviceId,
        realStateName: request.query.realStateName,
        deviceCode: request.query.deviceCode,
        isMasterDevice: request.query.isMasterDevice
    };

    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.DEVICES, filterData).then((devices) => {
        response.status(200).json(devices);
    }).catch(() => {
        response.status(409).send("device not found");
    });
});


router.post('/insert', function (request, response, next) {
    let dataObject = {
        deviceId: request.body.deviceId,
        realStateName: request.body.realStateName,
        deviceCode: request.body.deviceCode,
        isMasterDevice: request.body.isMasterDevice
    };

    if (dataObject.deviceId) {
        Object.keys(dataObject).forEach(key => dataObject[key] === undefined && delete dataObject[key]);
        db.find(db.COLLECTIONS.DEVICES, {deviceId: request.body.deviceId}).then((devices) => {
            if (devices === null || devices === undefined || devices.length === 0) {
                dataObject.deviceCode = getUuid(dataObject.deviceId);
                db.insert(db.COLLECTIONS.DEVICES, dataObject).then(() => {
                    response.status(200).json();
                }).catch(() => {
                    response.status(409).send("device did not added");
                });
            } else {
                response.status(200).json(devices[0].deviceCode);
            }
        }).catch(() => {
            dataObject.deviceCode = getUuid(dataObject.deviceId);
            db.insert(db.COLLECTIONS.DEVICES, dataObject).then(() => {
                response.status(200).json();
            }).catch(() => {
                response.status(409).send("device did not added");
            });
        });
    } else {
        response.status(409).send("device id not found");
    }
});

router.post('/delete', function (request, response, next) {
    let query = {
        deviceId: request.body.deviceId,
    };
    db.deleteFunction(db.COLLECTIONS.DEVICES, query).then((devices) => {
        response.status(200).json(devices);
    }).catch(() => {
        response.status(409).send("device not found");
    });
});

module.exports = router;
