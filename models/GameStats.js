const mongoose = require("mongoose");

const gameStatsSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        opponent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        game: {
            type: String,
            required: true,
            default: "tic-tac-toe",
        },

        gamesPlayed: {
            type: Number,
            default: 0,
        },

        wins: {
            type: Number,
            default: 0,
        },

        losses: {
            type: Number,
            default: 0,
        },

        draws: {
            type: Number,
            default: 0,
        },

    },
    {
        timestamps: true,
    }
);

gameStatsSchema.index(
    {
        user: 1,
        opponent: 1,
        game: 1,
    },
    {
        unique: true,
    }
);

module.exports =
    mongoose.model(
        "GameStats",
        gameStatsSchema
    );
