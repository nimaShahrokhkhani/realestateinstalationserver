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
        isActiveDevice: request.query.isActiveDevice
    };

    Object.keys(filterData).forEach(key => filterData[key] === undefined && delete filterData[key]);
    db.find(db.COLLECTIONS.DEVICES, filterData).then((devices) => {
        response.status(200).json(devices);
    }).catch(() => {
        response.status(409).send("device not found");
    });
});


router.post('/getActivationCode', function (request, response, next) {
    let dataObject = {
        deviceId: request.body.deviceId,
        realStateName: request.body.realStateName
    };

    if (dataObject.deviceId) {
        Object.keys(dataObject).forEach(key => dataObject[key] === undefined && delete dataObject[key]);
        db.find(db.COLLECTIONS.DEVICES, {deviceId: request.body.deviceId}).then((devices) => {
            if (devices === null || devices === undefined || devices.length === 0) {
                dataObject.deviceCode = getUuid(dataObject.deviceId);
                dataObject.isActiveDevice = false;
                db.insert(db.COLLECTIONS.DEVICES, dataObject).then(() => {
                    response.status(200).json(dataObject.deviceCode);
                }).catch(() => {
                    response.status(409).send("device did not added");
                });
            } else {

                let newValues = {
                    $set: {
                        realStateName: dataObject.realStateName,
                        isActiveDevice: false,
                    }
                };
                db.update(db.COLLECTIONS.DEVICES, {deviceId: dataObject.deviceId} , newValues ).then((configs) => {
                    response.status(200).json(devices[0].deviceCode);
                }).catch(() => {
                    response.status(409).send("device did not added");
                });
            }
        }).catch(() => {
            dataObject.deviceCode = getUuid(dataObject.deviceId);
            dataObject.isActiveDevice = false;
            db.insert(db.COLLECTIONS.DEVICES, dataObject).then(() => {
                response.status(200).json(dataObject.deviceCode);
            }).catch(() => {
                response.status(409).send("device did not added");
            });
        });
    } else {
        response.status(409).send("device id not found");
    }
});

router.post('/activeDevice', function (request, response, next) {
    let dataObject = {
        deviceId: request.body.deviceId,
        realStateName: request.body.realStateName,
        deviceCode: request.body.deviceCode
    };

    if (dataObject.deviceId) {
        Object.keys(dataObject).forEach(key => dataObject[key] === undefined && delete dataObject[key]);
        db.find(db.COLLECTIONS.DEVICES, {deviceId: request.body.deviceId}).then((devices) => {
            if (devices === null || devices === undefined || devices.length === 0) {
                response.status(409).send("device id not found");
            } else {
                if (devices[0].deviceCode === dataObject.deviceCode) {

                    let newValues = {
                        $set: {
                            isActiveDevice: true,
                        }
                    };
                    db.update(db.COLLECTIONS.DEVICES, {deviceId: dataObject.deviceId} , newValues ).then((configs) => {
                        response.status(200).json(dataObject.deviceCode);
                    }).catch(() => {
                        response.status(409).send("device did not added");
                    });
                } else {
                    response.status(409).send("device id not match");
                }
            }
        }).catch(() => {
            response.status(409).send("device id not found");
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
