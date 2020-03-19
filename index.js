const { ApolloServer, gql } = require('apollo-server');

// schema definition
const typeDefs = gql`
    type User {
        id: ID!
        name: String!
		email: String
        posts: [Post]
    }

    type Post {
        id: ID!
        body: String
        date: String!
        author: User!
    }
    
    type Query {
        users: [User]!
        user(id: ID!, postId: ID): User
        posts: [Post]
        post(id: ID!): Post
    }`


let userRepository = [
    {id: '1', name: 'Andrea', posts: [{id: '1'}, {id: '3'}, {id: '4'}]},
    {id: '2', name: 'Marco', posts: [{id: '2'}], email: 'm@example.com'}
]
let postRepository = [
    {id: '1', body: 'Primo post', author: {id: '1'}, date: new Date(2020,2,1)},
    {id: '2', body: 'Secondo post', author: {id: '2'}, date: new Date(2020,2,3)},
    {id: '3', body: 'Terzo post', author: {id: '1'}, date: new Date(2020,2,10)},
    {id: '4', body: 'Quarto post', author: {id: '1'}, date: new Date(2020,2,11)},
]

const resolvers = {
    Query: {
        users: () => {
            map = userRepository
            map.forEach(user => {
                user.posts = user.posts.map(x => postRepository.find(post => post.id === x.id))
            }); 
            return map
        },
        user: (parent, args) => {
            user = userRepository.find(user => user.id === args.id)
            user.posts = user.posts.map(x => postRepository.find(post => post.id === x.id))
            if (args.postId)
                user.posts = [user.posts.find(y => y.id === args.postId)]
            return user
        },
        posts: () => {
            map = postRepository
            map.forEach(post => {
                post.author = userRepository.find(user => user.id === post.author.id)
            }); 
            return map
        },
        post: (parent, args) => {
            post = postRepository.find(post => post.id === args.id)
            post.author = userRepository.find(user => user.id === post.author.id)
            return post
        },
    }  
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`?? Blogger server run on: ${url}`);
});
