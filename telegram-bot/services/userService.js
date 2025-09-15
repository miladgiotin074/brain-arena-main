const User = require('../models/User');
const messages = require('../messages');

/**
 * Find or create a user in the database
 * @param {Object} telegramUser - Telegram user object from message
 * @returns {Promise<Object>} User document
 */
const findOrCreateUser = async (telegramUser) => {
  try {
    const { id: userId, first_name: firstName, last_name: lastName, username } = telegramUser;
    
    // Try to find existing user
    let user = await User.findByUserId(userId);
    
    if (user) {
      // Update last activity and return existing user
      await user.updateActivity();
      console.log(messages.console.userFound.replace('{userId}', userId));
      return user;
    }
    
    // Create new user if not found
    user = await User.createUser({
      userId,
      firstName,
      lastName: lastName || '',
      username: username || ''
    });
    
    console.log(messages.console.userCreated.replace('{userId}', userId));
    return user;
    
  } catch (error) {
    console.error(messages.errors.userOperationFailed, error.message);
    throw error;
  }
};

/**
 * Update user information
 * @param {Number} userId - Telegram user ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user document
 */
const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByUserId(userId);
    
    if (!user) {
      throw new Error(messages.errors.userNotFound);
    }
    
    Object.assign(user, updateData);
    await user.save();
    
    console.log(messages.console.userUpdated.replace('{userId}', userId));
    return user;
    
  } catch (error) {
    console.error(messages.errors.userUpdateFailed, error.message);
    throw error;
  }
};

/**
 * Get user by Telegram ID
 * @param {Number} userId - Telegram user ID
 * @returns {Promise<Object|null>} User document or null
 */
const getUserById = async (userId) => {
  try {
    const user = await User.findByUserId(userId);
    return user;
  } catch (error) {
    console.error(messages.errors.userFetchFailed, error.message);
    throw error;
  }
};

/**
 * Add coins to user
 * @param {Number} userId - Telegram user ID
 * @param {Number} amount - Amount of coins to add
 * @returns {Promise<Object>} Updated user document
 */
const addCoinsToUser = async (userId, amount) => {
  try {
    const user = await User.findByUserId(userId);
    
    if (!user) {
      throw new Error(messages.errors.userNotFound);
    }
    
    await user.addCoins(amount);
    console.log(messages.console.coinsAdded.replace('{amount}', amount).replace('{userId}', userId));
    return user;
    
  } catch (error) {
    console.error(messages.errors.coinUpdateFailed, error.message);
    throw error;
  }
};

/**
 * Add XP to user and handle level up
 * @param {Number} userId - Telegram user ID
 * @param {Number} amount - Amount of XP to add
 * @returns {Promise<Object>} Updated user document
 */
const addXPToUser = async (userId, amount) => {
  try {
    const user = await User.findByUserId(userId);
    
    if (!user) {
      throw new Error(messages.errors.userNotFound);
    }
    
    const oldLevel = user.level;
    await user.addXP(amount);
    
    if (user.level > oldLevel) {
      console.log(messages.console.levelUp.replace('{userId}', userId).replace('{level}', user.level));
    }
    
    console.log(messages.console.xpAdded.replace('{amount}', amount).replace('{userId}', userId));
    return user;
    
  } catch (error) {
    console.error(messages.errors.xpUpdateFailed, error.message);
    throw error;
  }
};

/**
 * Add score to user
 * @param {Number} userId - Telegram user ID
 * @param {Number} amount - Amount of score to add
 * @returns {Promise<Object>} Updated user document
 */
const addScoreToUser = async (userId, amount) => {
  try {
    const user = await User.findByUserId(userId);
    
    if (!user) {
      throw new Error(messages.errors.userNotFound);
    }
    
    await user.addScore(amount);
    console.log(messages.console.scoreAdded.replace('{amount}', amount).replace('{userId}', userId));
    return user;
    
  } catch (error) {
    console.error(messages.errors.scoreUpdateFailed, error.message);
    throw error;
  }
};

module.exports = {
  findOrCreateUser,
  updateUser,
  getUserById,
  addCoinsToUser,
  addXPToUser,
  addScoreToUser
};