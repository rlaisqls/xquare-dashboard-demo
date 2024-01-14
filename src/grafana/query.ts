
export interface projectProps {
    name, type, environment, team: string
}

const namespace = ({name, type, environment, team}: projectProps) => {
    return `${team}-${environment}`
}

const workload = ({name, type, environment, team}: projectProps) => {
    return `${name}-${type}-${environment}`
}

export const cpuMetricQuery = (props: projectProps) => `
sum(
    node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{cluster=\"\", namespace=\"${namespace(props)}\"}
  * on(namespace,pod)
    group_left(workload, workload_type)
    namespace_workload_pod:kube_pod_owner:relabel{cluster=\"\", namespace=\"${namespace(props)}\", workload=\"${workload(props)}\", workload_type=~\"deployment\"}
) by (pod)`

export const memoryMetricQuery = (props: projectProps) => `
sum(
    container_memory_working_set_bytes{cluster=\"\", namespace="${namespace(props)}", container!="", image!=""}
  * on(namespace,pod)
    group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{cluster=\"\", namespace="${namespace(props)}", workload=\"${workload(props)}\", workload_type=~\"deployment\"}
) by (pod)
`

export const logQuery = (props: projectProps) => `
    {job=\"${namespace(props)}/${workload(props)}\", container=~\"${workload(props)}\", stream=~\"stdout\"} |~ \"(?i)\" 
`
