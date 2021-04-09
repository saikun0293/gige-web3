const Transactions = artifacts.require("./Transactions.sol")

require("chai").use(require("chai-as-promised")).should()

contract("Transactions", ([accn1, buyer, seller]) => {
	let transactions

	before(async () => {
		transactions = await Transactions.deployed()
	})

	describe("User Authentication", () => {
		it("signs-up 3 users", async () => {
			await transactions.signUp("a1", "a1", "a1", { from: accn1 })
			await transactions.signUp("b1", "b1", "b1", { from: buyer })
			await transactions.signUp("c1", "c1", "c1", { from: seller })
			await transactions.signUp("d1", "d1", "d1", { from: seller }).should.be.rejected
		})

		it("fetches user info", async () => {
			const user1 = await transactions.fetchUserInfo({ from: accn1 })
			assert.deepEqual({ 0: "a1", 1: "a1", 2: "a1", name: "a1", email: "a1", phone: "a1" }, user1)
			const user2 = await transactions.fetchUserInfo({ from: buyer })
			assert.deepEqual({ 0: "b1", 1: "b1", 2: "b1", name: "b1", email: "b1", phone: "b1" }, user2)
			const user3 = await transactions.fetchUserInfo({ from: seller })
			assert.deepEqual({ 0: "c1", 1: "c1", 2: "c1", name: "c1", email: "c1", phone: "c1" }, user3)
		})
	})

	describe("Products", () => {
		it("creates a selling product post", async () => {
			await transactions.sellProduct(
				"xyz",
				"url1",
				"url2",
				"description for xyz",
				"location 123",
				web3.utils.toWei("1", "Ether"),
				{ from: seller }
			)
			await transactions.sellProduct(
				"xyz",
				"url1",
				"url2",
				"description for xyz",
				"location 123",
				web3.utils.toWei("2", "Ether"),
				{ from: seller }
			)
			await transactions.sellProduct(
				"xyz",
				"url1",
				"url2",
				"description for xyz",
				"location 123",
				web3.utils.toWei("4", "Ether"),
				{ from: seller }
			)
			await transactions.sellProduct(
				"xyz",
				"url1",
				"url2",
				"description for xyz",
				"location 123",
				web3.utils.toWei("5", "Ether"),
				{ from: seller }
			)
		})

		it("buys a product for sale", async () => {
			await transactions.buyProduct(3, { from: buyer, value: web3.utils.toWei("5", "Ether") })
			await transactions.buyProduct(3, { from: buyer, value: web3.utils.toWei("5", "Ether") })
				.should.be.rejected
			await transactions.buyProduct(2, { from: buyer, value: web3.utils.toWei("10", "Ether") })
			await transactions.buyProduct(5).should.be.rejected
			await transactions.buyProduct(0, { from: seller }).should.be.rejected
		})

		it("checks every product transaction", async () => {
			const result = await transactions.fetchProduct(3)
			assert.equal(result.productName, "xyz")
			assert.equal(result.owner, buyer)
			assert.equal(result.seller, seller)
			assert.equal(result.imageUrl1, "url1")
			assert.equal(result.imageUrl2, "url2")
			assert.equal(result.description, "description for xyz")
			assert.equal(result.location, "location 123")
			assert.equal(result.price, web3.utils.toWei("5", "Ether"))
		})
	})
})
