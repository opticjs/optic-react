# Optic React

The official React binding for Optic. It provides declarative data fetching for React components. In this respect it was heavily influenced by Facebook's Relay project but otherwise it's pretty different. Most notably because it's designed to work with arbitrary back-ends (so there's no dependency on GraphQL). Optic works with REST out of the box, but it can be configured to use a custom adapter if your API is based on WebSockets, JSONP, etc.

## Features


The way that Optic avoids the GraphQL dependency is by **not** trying to solve the over-fetching problem. The over-fetching problem (as described by Facebook) is the need to request an entire resource from the API even if only a portion of that resource is actually required by the UI. Similarly, if the UI requires data that is spread across multiple endpoints then multiple network calls are needed before data is rendered.

Optic is built on the 
