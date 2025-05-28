const Profile = require('../schema/profile.schema');

async function saveProfiles(profiles) {
    if (!Array.isArray(profiles) || profiles.length === 0) {
        return { message: 'No profiles to upsert' };
    }

    const bulkOps = profiles.map((profile) => {
        return {
            updateOne: {
                filter: {
                    platform: profile.platform,
                    profileUrl: profile.profileUrl,
                },
                update: { $set: profile },
                upsert: true,
            },
        };
    });

    try {
        const result = await Profile.bulkWrite(bulkOps);
        return {
            matched: result.matchedCount,
            modified: result.modifiedCount,
            upserted: result.upsertedCount,
        };
    } catch (error) {
        console.error('Bulk upsert error:', error);
        throw error;
    }
}

module.exports = { saveProfiles };
