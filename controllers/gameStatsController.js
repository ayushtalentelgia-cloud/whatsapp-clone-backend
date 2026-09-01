const GameStats = require("../models/GameStats");


// =========================================
// GET GAME STATS AGAINST OPPONENT
// =========================================

const getGameStats = async (req, res) => {

    try {

        const userId =
            req.user._id;

        const {
            opponentId,
            game
        } = req.query;


        if (!opponentId) {

            return res.status(400).json({

                success: false,

                message:
                    "Opponent ID is required."

            });

        }


        const gameName =
            game ||
            "tic-tac-toe";


        let stats =
            await GameStats.findOne({

                user:
                    userId,

                opponent:
                    opponentId,

                game:
                    gameName

            });


        // =====================================
        // NO PREVIOUS GAMES
        // =====================================

        if (!stats) {

            return res.status(200).json({

                success: true,

                stats: {

                    gamesPlayed: 0,

                    wins: 0,

                    losses: 0,

                    draws: 0

                }

            });

        }


        return res.status(200).json({

            success: true,

            stats: {

                gamesPlayed:
                    stats.gamesPlayed,

                wins:
                    stats.wins,

                losses:
                    stats.losses,

                draws:
                    stats.draws

            }

        });

    }
    catch (error) {

        console.error(
            "❌ Get game stats error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to get game stats."

        });

    }

};


// =========================================
// UPDATE GAME STATS
// =========================================

const updateGameStats = async (
    req,
    res
) => {

    try {

        const {
            opponentId,
            game,
            result
        } = req.body;


        if (
            !opponentId ||
            !result
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Opponent ID and result are required."

            });

        }


        if (
            ![
                "win",
                "loss",
                "draw"
            ].includes(result)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid game result."

            });

        }


        const gameName =
            game ||
            "tic-tac-toe";


        const increment = {

            gamesPlayed:
                1

        };


        if (
            result ===
            "win"
        ) {

            increment.wins =
                1;

        }


        if (
            result ===
            "loss"
        ) {

            increment.losses =
                1;

        }


        if (
            result ===
            "draw"
        ) {

            increment.draws =
                1;

        }


        const stats =
            await GameStats.findOneAndUpdate(

                {

                    user:
                        req.user._id,

                    opponent:
                        opponentId,

                    game:
                        gameName

                },

                {

                    $inc:
                        increment

                },

                {

                    new: true,

                    upsert: true,

                    setDefaultsOnInsert:
                        true

                }

            );


        return res.status(200).json({

            success: true,

            stats: {

                gamesPlayed:
                    stats.gamesPlayed,

                wins:
                    stats.wins,

                losses:
                    stats.losses,

                draws:
                    stats.draws

            }

        });

    }
    catch (error) {

        console.error(
            "❌ Update game stats error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update game stats."

        });

    }

};


module.exports = {

    getGameStats,

    updateGameStats

};
