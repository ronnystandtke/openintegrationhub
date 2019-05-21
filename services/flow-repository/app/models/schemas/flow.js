

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const node = new Schema({
  id: { type: String, required: [true, 'Flow nodes require an id.'], maxlength: 10 },
  componentId: {
    type: String,
    required: [true, 'Flow nodes require a componentId.'],
    validate: {
      validator(n) {
        return (mongoose.Types.ObjectId.isValid(n));
      },
      message: props => `The componentId "${props.value}" is not a valid ID for the component repository.`,
    },
  },
  function: { type: String, required: [true, 'Flow nodes require a function.'], maxlength: 30 },
  name: { type: String, maxlength: 30 },
  description: { type: String, maxlength: 100 },
  fields: {},
  _id: false,
});

const edge = new Schema({
  id: { type: String, maxlength: 10 },
  config: {
    condition: { type: String, maxlength: 30 },
    mapper: {},
  },
  source: { type: String, required: [true, 'Flow edges require a source.'], maxlength: 10 },
  target: { type: String, required: [true, 'Flow edges require a target.'], maxlength: 10 },
  _id: false,
});

const owner = new Schema({
  id: { type: String, required: [true, 'Flow owners require an id.'], maxlength: 30 },
  type: { type: String, required: [true, 'Flow owners require a type.'], maxlength: 30 },
  _id: false,
});

const graph = new Schema({
  nodes: {
    type: [node],
    validate: {
      validator(n) {
        return (n.length > 0);
      },
      message: 'Flows require at least one node.',
    },
  },
  edges: {
    type: [edge],
    validate: {
      validator(e) {
        return !(this.nodes.length > 1 && e.length === 0);
      },
      message: 'Flows with more than one node require edges.',
    },
  },
  _id: false,
});

// Define schema
const flow = new Schema({
  name: { type: String, maxlength: 30 },
  description: { type: String, maxlength: 100 },
  graph: { type: graph, required: [true, 'Flows require a graph.'] },
  type: { type: String, maxlength: 30 },
  owners: { type: [owner] },
  status: { type: String, default: 'inactive' },
  cron: { type: String, maxlength: 20 },
},
{ collection: 'flows', timestamps: true });

module.exports.flow = flow;
