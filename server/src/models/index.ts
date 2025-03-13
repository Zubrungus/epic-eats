import sequelize from '../config/connection.js';
import { UserFactory, associateUser } from './user.js';
import { UserEats, associateUserEats } from './userEats.js';


const User = UserFactory(sequelize);

// Initialize associations after all models are imported
associateUser();
associateUserEats();

export { sequelize, User, UserEats };
