//解析field
function parseField(field) {
  return field.split(/\[|\]/).filter(s => s);
}

// 得到field
function getField(req, field) {
  let value = req.body;
  //纵向解析数据
  field.array.forEach(prop => {
    value = value[prop];
  });
  return value;
}

exports.required = field => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field)) {
      next();
    } else {
      res.error(`${field.join(" ")} is required`);
      res.redirect("back");
    }
  };
};

//大于多少的校验规则
exports.lengthAbove = (field, len) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(field) > len) {
      next();
    } else {
      res.error(`${field.join("")} must have more than ${len} characters`);
      res.redirect("back");
    }
  };
};
