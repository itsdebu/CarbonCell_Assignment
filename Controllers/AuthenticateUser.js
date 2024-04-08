const User = require('../Models/UserModel')

const editProfile = async (req, res) => {

    try {
        const userId = req.user._id;
        const { name, bio } = req.body;

        const user = await User.findById(userId).select('-password');

        const previous_name = user.name;

        if (name && !bio) {
            await User.findByIdAndUpdate(userId, { name });

            return res.status(200).json({
                message: `Name changed from ${previous_name} to ${name}`,
                user
            })
        }
        else if (bio && !name) {
            await User.findByIdAndUpdate(userId, { bio });

            return res.status(200).json({
                message: 'Bio Successfully updated',
                user
            })
        }
        else {
            await User.findByIdAndUpdate(userId, { name, bio });

            return res.status(200).json({
                message: `Name changed from ${previous_name} to ${name} and bio is updated.`,
                user
            })
        }


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { editProfile }