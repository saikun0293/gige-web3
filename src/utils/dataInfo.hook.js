import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

export const useDataInfo = (fetchInfoData, ifErrorRevertTo) => {
	const history = useHistory()

	const [data, setData] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		;(async () => {
			try {
				const res = await fetchInfoData()
				setData(res)
			} catch (err) {
				setError(err)
				if (ifErrorRevertTo !== undefined) history.replace(ifErrorRevertTo)
			}
		})()
	}, [history, ifErrorRevertTo])

	return { data, error }
}
