import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { Card } from '@blueprintjs/core'
import * as R from "remeda"

import Sidebar from '@repo/ui/components/Sidebar';
import { ConfigContext, defaultConfig, readConfig, writeConfig } from './config';
import Footer from '@repo/ui/components/Footer';
import { Config } from '@repo/types';
import { useConnections } from './db';
import { db } from '@repo/storage';

export default function App() {
    const [isDark, setDark] = useState<boolean>(() => {
        // Read the isDark value from local storage (or false if it's not set)
        return JSON.parse(localStorage.getItem('isDark') || 'false') as boolean;
    });
    const [config, setConfig] = useState<Config>(defaultConfig)
    const connections = useConnections()

    useEffect(() => {
        readConfig()
            .then(config => {
                setConfig(config)
                console.log("Loaded configuration from local storage")
            })
            .catch(console.error)
    }, [])

    useEffect(() => {
        console.log("Writing configuration to local storage")
        writeConfig(config).catch(console.error)
    }, [config])

    useEffect(() => {
        // Migration connections from the legacy format to the new format.
        if (connections.isLoaded && connections.data.length === 0 && config.connections.length > 0) {
            console.log("Copying legacy connections into IndexedDB");
            config.connections.forEach(v => {
                db.connections.add({label: v.name || "", baseUrl: v.baseUrl, host: v.host, token: v.auth}).catch(console.error)
            })
        }
    }, [config, connections]);

    useEffect(() => {
        // Write the isDark value to local storage whenever it changes
        localStorage.setItem('isDark', JSON.stringify(isDark));
    }, [isDark]);

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            <div className={clsx("app", isDark && "bp5-dark")}>
                <Sidebar isDark={isDark} onDarkChange={() => setDark(v => !v)}/>
                <main>
                    <div>
                        {(connections.isLoaded && connections.data.length === 0) &&
                            <Card className="announcement">
                                No connections are configured. Please go to <Link to="/settings">the settings page</Link> to add a new connection.
                            </Card>}
                        <Outlet/>
                        <Footer commit={import.meta.env.VITE_COMMIT_SHA}/>
                    </div>
                </main>
            </div>
        </ConfigContext.Provider>
    )
}