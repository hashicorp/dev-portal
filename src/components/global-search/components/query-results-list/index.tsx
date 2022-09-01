import Badge from 'components/badge'
import Text from 'components/text'
import s from './global-search-query-results-list.module.css'

const QueryResultsList = ({ data, isLoading }) => {
	if (!data || data.length < 0) {
		return null
	}

	if (isLoading) {
		return <p>loading...</p>
	}

	return (
		<ul className={s.root}>
			{data.map(({ title, description, product }) => (
				<li key={title} className={s.listItem}>
					<span className={s.titleRow}>
						<Text
							asElement="span"
							className={s.titleText}
							size={200}
							weight="medium"
						>
							{title}
						</Text>
						<Badge
							color="neutral"
							size="small"
							text={product.name}
							type="outlined"
						/>
					</span>
					<Text
						asElement="span"
						className={s.descriptionText}
						size={100}
						weight="regular"
					>
						{description}
					</Text>
				</li>
			))}
		</ul>
	)
}

export default QueryResultsList
