const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class subCategory extends Model {
        static associate(models) {
            // define associations here if needed
        }
    }

    subCategory.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        altText: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        platform: {
            type: DataTypes.STRING,
            defaultValue: 'tiktok',
        },
        categorySlug: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'subCategory',
        tableName: 'categories',
        timestamps: true,
    });

    return subCategory;
};
