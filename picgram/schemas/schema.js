import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import post from './post'
import comment from './comment'
import user from './user'
import postedBy from './postedBy'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    post, user, comment, postedBy
  ]),
})
