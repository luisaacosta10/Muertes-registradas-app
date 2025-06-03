import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import Papa from 'papaparse'
import './index.css'

function App() {
  const [data, setData] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('Colombia')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch('/src/data/share-of-deaths-registered.csv')
      .then(response => response.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true }).data
        const cleaned = parsed.filter(row => row['Entidad'] && row['Año'] && row['Proporción de muertes registradas'])
        setData(cleaned)

        const uniqueCountries = [...new Set(cleaned.map(row => row['Entidad']))].sort()
        setCountries(uniqueCountries)
      })
  }, [])

  const filteredData = data
    .filter(row => row['Entidad'] === selectedCountry)
    .map(row => ({
      year: row['Año'],
      porcentaje: parseFloat(row['Proporción de muertes registradas'])
    }))

  return (
    <div style={{ padding: '20px' }}>
      <h1>Proporción de Muertes Registradas</h1>
      <p>Selecciona un país:</p>
      <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
        {countries.map(c => <option key={c}>{c}</option>)}
      </select>
      <LineChart width={800} height={400} data={filteredData} margin={{ top: 20, right: 30, bottom: 5, left: 20 }}>
        <Line type="monotone" dataKey="porcentaje" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
      <section style={{ marginTop: '30px' }}>
        <h2>Documentación</h2>
        <p><strong>Fuente:</strong> Nuestro Mundo en Datos</p>
        <p><strong>Variables:</strong> Entidad (país), Año, Proporción de muertes registradas</p>
        <p><strong>Cobertura:</strong> Global, desde años recientes hasta 2019</p>
        <p><strong>Análisis disponibles:</strong> Comparación por país, evolución temporal, variación porcentual</p>
        <p><strong>Importancia:</strong> Las visualizaciones ayudan a entender el progreso en el registro de datos vitales, útil en políticas públicas, salud y desarrollo institucional.</p>
      </section>
    </div>
  )
}

export default App