require("ts-node/register");

module.exports = {
  // this is required by truffle to find any ts test files
  test_file_extension_regexp: /.*\.ts$/,
  networks: {
      development: {
          host: "localhost",
          port: 8545,
          network_id: "*" // Match any network id
      }
  }
};