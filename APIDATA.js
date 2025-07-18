Base Url : http://13.233.175.113

1.Trip Information : 

GET :11014/trips/list-trips/{userId}

Response:

{
  "list": [
    {
      "category": "string",
      "driverFirstName": "string",
      "driverId": 0,
      "driverImage": "string",
      "driverLastName": "string",
      "driverMiddleName": "string",
      "endDate": "string",
      "geofenceCount": 0,
      "isOnward": true,
      "isRecurring": true,
      "message": "string",
      "onwardActualEndTime": "yyyy-MM-dd HH:mm:ss",
      "onwardActualStartTime": "yyyy-MM-dd HH:mm:ss",
      "onwardEndTime": "string",
      "onwardStartTime": "string",
      "returnActualEndTime": "yyyy-MM-dd HH:mm:ss",
      "returnActualStartTime": "yyyy-MM-dd HH:mm:ss",
      "returnEndTime": "string",
      "returnStartTime": "string",
      "status": "string",
      "tripId": 0,
      "tripName": "string",
      "uuid": "string",
      "vehicleId": 0,
      "vehicleName": "string"
    }
  ],
  "success": true
}

2.Vehicle details

GET :11018/api/list-vehicles/{userId}

Response:

{
  "list": [
    {
      "axleConfigurationTotal": 0,
      "cargoCapacity": 0,
      "chassisNumber": "string",
      "color": "string",
      "costPerLitre": 0,
      "depotId": 0,
      "depotName": "string",
      "deviceId": 0,
      "deviceName": "string",
      "drive": 0,
      "frameNumber": "string",
      "fuelConsumptionPer100km": 0,
      "fuelGrade": "string",
      "fuelType": "PETROL",
      "grossWeight": 0,
      "group": "string",
      "height": 0,
      "img": "string",
      "insurances": [
        {
          "insuranceExpiry": "2022-07-19T13:06:19.558Z",
          "insuranceId": 0,
          "insuranceName": "string",
          "vehicleId": 0
        }
      ],
      "licensePlate": "string",
      "manufactureYear": 0,
      "model": "string",
      "orgId": 0,
      "passengerCapacity": 0,
      "payloadLength": 0,
      "permittedSpeed": 0,
      "tags": [
        {
          "tagId": 0,
          "tagName": "string"
        }
      ],
      "tankCapacity": 0,
      "tireNumber": 0,
      "tireSize": 0,
      "trailer": "string",
      "vehicleId": 0,
      "vehicleName": "string",
      "vehicleSubtypeId": 0,
      "vehicleSubtypeName": "string",
      "vehicleTypeId": 0,
      "vehicleTypeName": "string",
      "vin": "string",
      "width": 0
    }
  ],
  "success": true
}

3.Vehicle Types

GET :11018/api/vehicle-types

Response:

[
  {
    "name": "string",
    "vehicleTypeId": 0
  }
]


4.Driver Information

GET :11022/api/drivers/{userId}

Response:

[
  {
    "deviceId": 0,
    "deviceName": "string",
    "driverId": 0,
    "email": "string",
    "firstName": "string",
    "image": "string",
    "isDisabledOrg": true,
    "isEnabled": true,
    "keycloakUser": "string",
    "lastName": "string",
    "licenseExpirationDate": "yyyy-MM-dd",
    "licenseNumber": "string",
    "licensePath": "string",
    "middleName": "string",
    "orgId": 0,
    "orgName": "string",
    "password": "string",
    "phoneNumber": "string",
    "subOrgId": 0,
    "subOrgName": "string",
    "userId": 0,
    "userName": "string",
    "userType": "DRIVER",
    "vehicleId": 0,
    "vehicleName": "string"
  }
]

5.Change Password


http://13.233.175.113:11020/api/update-password

Body
{
    "email_address" : "jacob@cogniphi.com",
    "password" : "Test@123"
}
or
{
    "mobile" : "9995395794",
    "password" : "Test@123"
}

Response
{
    "code": 200,
    "message": "Password updated successfully"
}

6.Tracking

POST : :11013/tracking/getTrack

Request:

{
  "fromTime": "yyyy-MM-dd HH:mm:ss",
  "id": 0,
  "toTime": "yyyy-MM-dd HH:mm:ss",
  "tripId": 0
}

Response:
{
  "list": [
    {
      "alt": 0,
      "dataId": 0,
      "distance": 0,
      "eventCode": 0,
      "heading": 0,
      "lattitude": 0,
      "longitude": 0,
      "mileage": 0,
      "satellites": 0,
      "speed": 0,
      "time": "yyyy-MM-dd HH:mm:ss",
      "valid": true
    }
  ],
  "success": true
}

7.Geofence

GET : :11015/geofence/stops/get/trip?tripId=


Response:

{
  "fenceList": [
    {
      "area": "string",
      "fenceId": 0,
      "fenceType": "CIRCLE",
      "geofenceName": "string",
      "isEndFence": true,
      "isPublic": true,
      "isStartFence": true,
      "seqFenceAM": "string",
      "seqFencePM": "string",
      "stopName": "string",
      "stopReturnTime": "2022-07-20T05:01:15.702Z",
      "stopTime": "2022-07-20T05:01:15.702Z",
      "stopTimeAM": {
        "hour": 0,
        "minute": 0,
        "nano": 0,
        "second": 0
      },
      "stopTimePM": {
        "hour": 0,
        "minute": 0,
        "nano": 0,
        "second": 0
      },
      "tags": [
        {
          "tagId": 0,
          "tagName": "string"
        }
      ]
    }
  ],
  "tripId": 0,
  "tripName": "string"
}