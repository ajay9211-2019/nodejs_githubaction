"use strict";
const nodemailer = require("nodemailer");

let responseFormat = function (status = true, data = {}, errors = {}, msg = "") {
  return {
    success: status,
    data: data,
    errors: errors,
    message: msg
  };
};
exports.responseFormat = responseFormat;

exports.makeResponse = (res, status, isSuccess, data, errors, msg) => {
  res.status(status);
  res.set("status_code", status);
  res.json(responseFormat(isSuccess, data, errors, msg));
};

let roles = [
  /* 0 */ "employee",//signin rest
  /* 1 */ "employer", //not in process
  /* 2 */ "operator", //operator
  /* 3 */ "driver", //signin rest
  /* 4 */ "admin", //not in process
  /* 5 */ "transport_desk_manager",
  /* 6 */ "line_manager", //sachinupawar35@gmail.com //not in process
  /* 7 */ "employer_shift_manager", //sachinupawar40@gmail.com //not in process
  /* 8 */ "operator_shift_manager", //sachinupawar41@gmail.com //not in process
  /* 9 */ "qc_data_entry",//signin rest
  /* 10 */ "operations_supervisor", //signin rest
  /* 11 */ "operations_admin", //signin rest
  /* 12 */ "commercial_manager", //signin rest
  /* 13 */ "qc_manager", //signin rest
  /* 14 */ "mdm_admin", //signin rest
  /* 15 */ "ct_manager", //signin rest
  /* 16 */ "ba_manager", //signin rest
  /* 17 */ "auditor" //signin rest
];
exports.roles = roles;

exports.roles_entity_type = [
  'Employee',
  'Employer',
  'Operator',
  'Driver',
  'Admin',
  'TransportDeskManager',
  'LineManager',
  'EmployerShiftManager',
  'OperatorShiftManager',
  'QcDataEntry',
  'OperationsSupervisor',
  'OperationsAdmin',
  'CommercialManager',
  'QcManager',
  'MdmAdmin',
  'CtManager',
  'BaManager',
  'Auditor'
]

exports.isValidEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }
  //     alert("You have entered an invalid email address!")
  return (false)
}

//Globally Declare Function to convert json data into String
exports.toJSONString = function (object) {
  return JSON.stringify(object);
}

//Globally Declare Function to convert json data into String
exports.toJSONObject = function (strObj) {
  return JSON.parse(strObj);
}

exports.equalsIgnoreCase = function (value1, value2) {
  if ((value1 != undefined && value1 !== null) && (value2 != undefined && value2 !== null)) {
    value1 = value1.toUpperCase();
    value2 = value2.toUpperCase();
    return value1 == value2;
  } else {
    return false;
  }
}

let isArray = function (object) {
  if (Object.prototype.toString.call(object) === '[object Array]') {
    return true;
  } else {
    return false;
  }
}
exports.isArray = isArray;

let isString = function (object) {
  if (typeof object === 'string') {
    return true;
  } else {
    return false;
  }
}
exports.isString = isString;


exports.isBoolean = function (object) {
  if (typeof object === 'boolean') {
    return true;
  } else {
    return false;
  }
}

exports.isObject = function (object) {
  if (Object.prototype.toString.call(object) === '[object Object]') {
    return true;
  } else {
    return false;
  }
}

exports.isNumber = function (object) {
  if (typeof object === 'number') {
    return true;
  } else {
    return false;
  }
}

exports.isEmptyArray = function (object) {
  if (object == undefined)
    return true;
  if (isArray(object)) {
    if (object.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}

exports.isEmptyOrNullObject = function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

exports.isNullOrEmpty = function (stringValue) {
  if (isString(stringValue)) {
    if (stringValue == null || stringValue == '' || stringValue == undefined) {
      return true;
    }
  } else {
    if (stringValue == null || stringValue == undefined) {
      return true;
    }
  }

  return false;
}

exports.isHaveOnlyAlphabetes = (inputtxt) => {
  var letters = /^[A-Za-z]+$/;
  if (inputtxt.match(letters)) {
    return true;
  }
  else {
    return false;
  }
}


exports.sendEmailFromClient = function (to, subject, htmlBody) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: subject,
    html: htmlBody,
  };

  return new Promise(function (fulfill, reject) {
    transporter.sendMail(mailOptions, async function (err, info) {
      if (err) {
        console.log("mail error : ",err)
        reject(err)
      }

      return fulfill(info);
    });
  });
};