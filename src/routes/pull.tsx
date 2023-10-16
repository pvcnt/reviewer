import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { getPull} from "@/github";
import { useParams } from 'react-router-dom';
import { ConfigContext } from '@/config';
import { Spinner } from '@blueprintjs/core';

export default function Pull() {
    const { host, org, repo, pullNumber } = useParams();
    const { config } = useContext(ConfigContext)
    const connection = config.connections.find(conn => conn.host == host)
    const { data, isLoading } = useQuery({
        queryKey: ['pull', host, org, repo, pullNumber],
        queryFn: () => getPull(connection, org, repo, pullNumber !== undefined ? parseInt(pullNumber) : 0),
        enabled: host !== undefined && org !== undefined && repo !== undefined && pullNumber !== undefined,
    })
    useEffect(() => {
        document.title = data?.title || "Loading..."
    }, [data?.title])
    if (isLoading) {
        return <Spinner/>
    }
    if (undefined === data) {
        return <div>error</div>
    }
    return (
        <>
            <h3>{data.title}</h3>
            <div>{host}:{org}/{repo} {pullNumber}</div>

            <div className="content" dangerouslySetInnerHTML={{__html: data.bodyHTML}}></div>

            <div>
                Reviewers: 
            </div>
        </>
    )
}