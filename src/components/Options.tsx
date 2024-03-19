
interface IOptionsProps {
  force: number;
  setForce: (value: React.SetStateAction<number>) => void;
  paused: boolean;
  setPaused: (value: React.SetStateAction<boolean>) => void;
}

function Options({force, paused, setForce, setPaused}: IOptionsProps) {
  return (
    <div className='options-container'>
      <label htmlFor="force">
        <input type="range" name="force" id="force" min={1} max={20} value={force} onChange={(e) => setForce(+e.currentTarget.value)}/>
        <h2>{force}</h2>
      </label>
      <button onClick={() => setPaused(paused => !paused)}>{paused ? 'Play' : 'Pause'}</button>
    </div>
  )
}

export default Options