import PropTypes from 'prop-types'

const DashboardStatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-level-1">
    <div className="flex items-center justify-between gap-space-sm">
      <div>
        <p className="text-label-md uppercase tracking-wider text-on-surface-variant">{title}</p>
        <p className="mt-1 font-headline text-headline-lg text-on-surface">{value}</p>
      </div>
      {Icon && (
        <span className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
          <Icon className="text-headline-sm" aria-hidden="true" />
        </span>
      )}
    </div>
  </div>
)

DashboardStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.elementType,
}

export default DashboardStatCard
