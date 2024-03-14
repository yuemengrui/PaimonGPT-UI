'use client'
import React, {useEffect, useRef, useState} from 'react'
import mermaid from 'mermaid'
import CryptoJS from 'crypto-js'

const mermaidAPI = mermaid.mermaidAPI
mermaidAPI.initialize({
    startOnLoad: true,
    theme: 'base',
    flowchart: {
        htmlLabels: false,
        useMaxWidth: false
    },
    themeVariables: {
        fontSize: '14px',
        primaryColor: '#d6e8ff',
        primaryTextColor: '#485058',
        primaryBorderColor: '#fff',
        lineColor: '#5A646E',
        secondaryColor: '#B5E9E5',
        tertiaryColor: '#485058'
    }
});


const style = {
    minWidth: '480px',
    height: '100%',
    overflow: 'auto',
}

// eslint-disable-next-line react/display-name
const Chart = React.forwardRef((props: {
    PrimitiveCode: string
}, ref) => {
    const [svgCode, setSvgCode] = useState(null)
    const chartId = useRef(`flowchart_${CryptoJS.MD5(props.PrimitiveCode).toString()}`)
    const [isRender, setIsRender] = useState(true)

    const clearFlowchartCache = () => {
        for (let i = localStorage.length - 1; i >= 0; --i) {
            const key = localStorage.key(i)
            if (key && key.startsWith('flowchart_'))
                localStorage.removeItem(key)
        }
    }

    const renderFlowchart = async (PrimitiveCode: string) => {
        try {
            const cachedSvg: any = localStorage.getItem(chartId.current)
            if (cachedSvg) {
                setSvgCode(cachedSvg)
                return
            }

            if (typeof window !== 'undefined' && mermaidAPI) {
                const svgGraph = await mermaidAPI.render(chartId.current, PrimitiveCode)
                const base64Svg: any = await svgToBase64(svgGraph.svg)
                setSvgCode(base64Svg)
                if (chartId.current && base64Svg)
                    localStorage.setItem(chartId.current, base64Svg)
            }
        } catch (error) {
            clearFlowchartCache()
            handleReRender()
        }
    }

    const svgToBase64 = (svgGraph: string) => {
        const svgBytes = new TextEncoder().encode(svgGraph)
        const blob = new Blob([svgBytes], {type: 'image/svg+xml;charset=utf-8'})
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }

    const handleReRender = () => {
        setIsRender(false)
        setSvgCode(null)
        if (chartId.current)
            localStorage.removeItem(chartId.current)

        setTimeout(() => {
            setIsRender(true)
            renderFlowchart(props.PrimitiveCode)
        }, 100)
    }

    useEffect(() => {
        setIsRender(false)
        setTimeout(() => {
            setIsRender(true)
            renderFlowchart(props.PrimitiveCode)
        }, 100)
    }, [props.PrimitiveCode])

    return (
        // @ts-expect-error
        <div ref={ref}>
            {
                isRender
                && <div id={chartId.current} className="mermaid">
                    {svgCode && <img src={svgCode} alt="Mermaid chart"/>}
                </div>
            }
        </div>
    )
})

export default Chart
