const bcrypt = require('bcrypt');
const SALT_ROUNDS = Number.parseInt(process.env.SALT_ROUNDS);

/**
 * used to hash passwords
 * @param {string} password 
 */
const hashPassword = async (password)=>{
    try{
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        //const hash = bcrypt.hashSync(password, salt);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
    catch(error){
        console.log(error);
    }
}

/**
 * used to comapare 
 * @param {string} password 
 * @param {string} hashedPassword 
 * @returns {boolean}
 */
const validatePassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error validating password');
    }
};

module.exports = {
    hashPassword,
    validatePassword
}