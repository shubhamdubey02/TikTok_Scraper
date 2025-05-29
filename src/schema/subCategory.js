const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SubCategory extends Model {
        static associate(models) {
            // define associations here if needed
        }
    }

    SubCategory.init({
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
        modelName: 'SubCategory',
        timestamps: true,
    });

    return SubCategory;
};
