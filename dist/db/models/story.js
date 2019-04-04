'use strict';

module.exports = function (sequelize, DataTypes) {
  var Story = sequelize.define('Story', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {});
  Story.associate = function (models) {
    // associations can be defined here
    // one Article belongs to one user 
    Story.belongsTo(models.User, {
      foreignKey: "author"
    });
  };
  return Story;
};