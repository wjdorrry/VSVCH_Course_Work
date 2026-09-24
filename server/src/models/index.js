import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(30), allowNull: false, unique: true },
}, { tableName: 'roles' });

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password_hash' },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  roleId: { type: DataTypes.INTEGER, allowNull: false, field: 'role_id' },
}, { tableName: 'users' });

export const EventType = sequelize.define('EventType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
}, { tableName: 'event_types', timestamps: false });

export const Status = sequelize.define('Status', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  label: { type: DataTypes.STRING(80), allowNull: false },
}, { tableName: 'statuses', timestamps: false });

export const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
}, { tableName: 'categories', timestamps: false });

export const Dish = sequelize.define('Dish', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  pricePerPerson: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'price_per_person' },
  isVegetarian: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_vegetarian' },
  isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
  imageKey: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'appetizer', field: 'image_key' },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, field: 'category_id' },
}, { tableName: 'dishes' });

export const CateringRequest = sequelize.define('CateringRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  eventDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'event_date' },
  guestsCount: { type: DataTypes.INTEGER, allowNull: false, field: 'guests_count', validate: { min: 1 } },
  address: { type: DataTypes.STRING(255), allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  estimatedTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'estimated_total' },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  eventTypeId: { type: DataTypes.INTEGER, allowNull: false, field: 'event_type_id' },
  statusId: { type: DataTypes.INTEGER, allowNull: false, field: 'status_id' },
}, { tableName: 'catering_requests' });

export const RequestItem = sequelize.define('RequestItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'unit_price' },
  requestId: { type: DataTypes.INTEGER, allowNull: false, field: 'request_id' },
  dishId: { type: DataTypes.INTEGER, allowNull: false, field: 'dish_id' },
}, { tableName: 'request_items' });

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Category.hasMany(Dish, { foreignKey: 'categoryId' });
Dish.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(CateringRequest, { foreignKey: 'userId' });
CateringRequest.belongsTo(User, { foreignKey: 'userId' });

EventType.hasMany(CateringRequest, { foreignKey: 'eventTypeId' });
CateringRequest.belongsTo(EventType, { foreignKey: 'eventTypeId' });

Status.hasMany(CateringRequest, { foreignKey: 'statusId' });
CateringRequest.belongsTo(Status, { foreignKey: 'statusId' });

CateringRequest.hasMany(RequestItem, { foreignKey: 'requestId', as: 'items', onDelete: 'CASCADE' });
RequestItem.belongsTo(CateringRequest, { foreignKey: 'requestId' });
Dish.hasMany(RequestItem, { foreignKey: 'dishId' });
RequestItem.belongsTo(Dish, { foreignKey: 'dishId' });

export const models = {
  Role,
  User,
  EventType,
  Status,
  Category,
  Dish,
  CateringRequest,
  RequestItem,
};
