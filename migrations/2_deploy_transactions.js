const AuthenticationLib = artifacts.require("AuthenticationLib")
const ProductLib = artifacts.require("ProductLib")
const Transactions = artifacts.require("Transactions")

module.exports = async deployer => {
	await deployer.deploy(AuthenticationLib)
	await deployer.deploy(ProductLib)
	await deployer.link(AuthenticationLib, Transactions)
	await deployer.link(ProductLib, Transactions)
	await deployer.deploy(Transactions)
}
