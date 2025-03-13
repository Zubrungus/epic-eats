import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/connection.js';

// Recipe attributes
interface UserEatAttributes {
  id: number;
  user_id: number;
  spoonacular_id: number;
  title: string;
  image_url?: string;
  source_url?: string;
  summary: string;
  instructions: string;
  ingredients: object[];
  created_at?: Date;
}

// Optional `id` and `created_at` when creating a UserEat
interface UserEatCreationAttributes extends Optional<UserEatAttributes, 'id' | 'created_at'> {}

// Sequelize Model for UserEats
export class UserEats extends Model<UserEatAttributes, UserEatCreationAttributes> {
  public id!: number;
  public user_id!: number;
  public spoonacular_id!: number;
  public title!: string;
  public image_url!: string;
  public source_url!: string;
  public summary!: string;
  public instructions!: string;
  public ingredients!: object[];
  public created_at!: Date;
}

UserEats.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    spoonacular_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'user_eats',
    timestamps: false,
  }
);

// Function to define associations AFTER both models are imported
export const associateUserEats = async () => {
  const { User } = await import('./user.js'); 

  UserEats.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
};

export default UserEats;
