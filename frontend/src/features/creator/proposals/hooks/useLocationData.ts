/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react"

const BASE = "https://api.geocoded.me"

interface Country {
  iso2: string
  name: string
}

interface State {
  iso2: string
  name: string
}

interface City {
  name: string
}

const countryCache = new Map<string, Country[]>()
const stateCache = new Map<string, State[]>()
const cityCache = new Map<string, City[]>()

export function useLocationData(currency: string) {
  const [countries, setCountries] = useState<Country[]>([])
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!currency) {
      setCountries([])
      setStates([])
      setCities([])
      return
    }

    const cached = countryCache.get(currency)
    if (cached) {
      setCountries(cached)
      return
    }

    setLoadingCountries(true)
    setStates([])
    setCities([])

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    fetch(`${BASE}/currencies/${currency}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const iso2List: string[] = data.countries ?? []
        return Promise.all(
          iso2List.map((iso2) =>
            fetch(`${BASE}/countries/${iso2}?fields=name,iso2`, { signal: controller.signal })
              .then((r) => r.json())
              .then((d) => ({ iso2: d.iso2 ?? iso2, name: d.name ?? iso2 }))
              .catch(() => ({ iso2, name: iso2 }))
          )
        )
      })
      .then((list) => {
        list.sort((a, b) => a.name.localeCompare(b.name))
        countryCache.set(currency, list)
        setCountries(list)
      })
      .catch(() => {})
      .finally(() => setLoadingCountries(false))

    return () => controller.abort()
  }, [currency])

  function loadStates(countryIso2: string) {
    if (!countryIso2) {
      setStates([])
      setCities([])
      return
    }

    const key = countryIso2
    const cached = stateCache.get(key)
    if (cached) {
      setStates(cached)
      setCities([])
      return
    }

    setLoadingStates(true)
    setCities([])

    fetch(`${BASE}/countries/${countryIso2}/states?fields=name,iso2&limit=500`)
      .then((r) => r.json())
      .then((data) => {
        const list: State[] = (data.data ?? []).map((s: { name: string; iso2: string }) => ({
          iso2: s.iso2,
          name: s.name,
        }))
        list.sort((a, b) => a.name.localeCompare(b.name))
        stateCache.set(key, list)
        setStates(list)
      })
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false))
  }

  function loadCities(countryIso2: string, stateIso2: string) {
    if (!countryIso2 || !stateIso2) {
      setCities([])
      return
    }

    const key = `${countryIso2}/${stateIso2}`
    const cached = cityCache.get(key)
    if (cached) {
      setCities(cached)
      return
    }

    setLoadingCities(true)

    fetch(`${BASE}/countries/${countryIso2}/states/${stateIso2}/cities?fields=name&limit=500`)
      .then((r) => r.json())
      .then((data) => {
        const list: City[] = (data.data ?? []).map((c: { name: string }) => ({ name: c.name }))
        list.sort((a, b) => a.name.localeCompare(b.name))
        cityCache.set(key, list)
        setCities(list)
      })
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false))
  }

  return {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    loadStates,
    loadCities,
  }
}
/* eslint-disable react-hooks/set-state-in-effect */
