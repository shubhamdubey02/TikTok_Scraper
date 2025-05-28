const Profile = require('../schema/profile.schema');


async function saveProfiles(profiles) {
    if (!profiles || !profiles.length) return;

    const operations = profiles.map(profile => ({
        updateOne: {
            filter: { profileUrl: profile.profileUrl },
            update: { $set: profile },
            upsert: true
        }
    }));

    try {
        await Profile.bulkWrite(operations, { ordered: false });
        console.log('✅ Profiles inserted/updated successfully');
    } catch (err) {
        console.error('❌ Error saving profiles:', err.message);
    }
}

module.exports = saveProfiles;
