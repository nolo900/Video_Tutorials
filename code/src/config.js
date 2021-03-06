const createKnexClient = require('./knex-client');
const createHomeApp = require('./app/home');
const createRecordViewingsApp = require('./app/record-viewings');

const createPostgresClient = require('./postgres-client');
const createMessageStore = require('./message-store');

const createHomePageAggregator = require('./aggregators/home-page');

function createConfig({ env }){
	// practical_microservices database
	const knexClient = createKnexClient({ connectionString: env.databaseUrl });
	// message_db database
	const postgresClient = createPostgresClient( { connectionString: env.messageStoreConnectionString });
	const messageStore = createMessageStore({ db: postgresClient });

	const homeApp = createHomeApp({ db: knexClient });
	const recordViewingsApp = createRecordViewingsApp({ messageStore });

	const homePageAggregator = createHomePageAggregator({
		db: knexClient,
		messageStore
	});

	const aggregators = [
		homePageAggregator
	];

	const components = [

	];

	return {
		messageStore,
		homeApp,
		recordViewingsApp,
		homePageAggregator,
		aggregators,
		components,
	}
}
module.exports = createConfig;
