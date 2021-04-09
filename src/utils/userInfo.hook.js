import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

export const useUserInfo = (transactions, account, ifErrorRevertTo) => {
	const history = useHistory()

	const [userInfo, setUserInfo] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		;(async () => {
			try {
				const res = await transactions.methods.fetchUserInfo().call({ from: account })
				setUserInfo(res)
			} catch (err) {
				setError(err)
				if (ifErrorRevertTo !== undefined) history.replace(ifErrorRevertTo)
			}
		})()
	}, [account, transactions.methods, history, ifErrorRevertTo])

	return { userInfo, error }
}
