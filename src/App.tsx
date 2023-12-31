import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { Card } from '@blueprintjs/core'

import Sidebar from './components/Sidebar';
import { Config, ConfigContext, defaultConfig, readConfig, writeConfig } from './config';

export default function App() {
    const [isDark, setDark] = useState(false)
    const [isLoaded, setLoaded] = useState(false)
    const [config, setConfig] = useState<Config>(defaultConfig)

    useEffect(() => {
        readConfig()
            .then(config => {
                setConfig(config)
                setLoaded(true)
                console.log("Loaded configuration from local storage")
            })
            .catch(console.error)
    }, [])

    useEffect(() => {
        console.log("Writing configuration to local storage")
        writeConfig(config).catch(console.error)
    }, [config])

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            <div className={clsx("app", isDark && "bp5-dark")}>
                <Sidebar isDark={isDark} onDarkChange={() => setDark(v => !v)}/>
                <main>
                    {(isLoaded && config.connections.length === 0) && 
                        <Card className="announcement">
                            No connections are configured. Please go to <Link to="/settings">the settings page</Link> to add a new connection.
                        </Card>}
                    <Outlet/>
                </main>
            </div>
        </ConfigContext.Provider>
    )
}