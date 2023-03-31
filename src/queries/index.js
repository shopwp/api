const queryOptionsNoRefetch = {
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
  refetchInterval: false,
}

const queryOptionsWithRefetch = {
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: true,
  refetchInterval: false,
}

export { queryOptionsNoRefetch, queryOptionsWithRefetch }
