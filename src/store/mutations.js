export default {
  save(state, data) {
    const keys = Object.keys(data);
    keys.forEach(item => {
      state[item] = data[item];
    });
  }
};
