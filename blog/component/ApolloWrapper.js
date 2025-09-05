"use client";
import { ApolloProvider } from '@apollo/client/react';
import { InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: '/api/graphQL',
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

export default function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
