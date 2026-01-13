import React, { useState } from 'react'

interface SelectedDay {
  date: Date
  dayName: string
  horoscope: string
}

const HOROSCOPE_MESSAGES = [
  "Today brings new opportunities for growth and self-discovery.",
  "Your creativity will shine brightly and inspire those around you.",
  "A moment of clarity will help you make an important decision.",
  "Unexpected connections may lead to meaningful relationships.",
  "Your perseverance will pay off in ways you hadn't imagined.",
  "Trust your intuition - it's guiding you toward the right path.",
  "A small act of kindness will create ripples of positive change.",
  "Your natural leadership qualities will be recognized today.",
  "Focus on balance - harmony between work and personal life awaits.",
  "An old dream may resurface with new possibilities attached.",
  "Your patience will be rewarded with something truly worthwhile.",
  "Communication flows easily - express yourself with confidence."
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null)

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day)
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    const randomHoroscope = HOROSCOPE_MESSAGES[Math.floor(Math.random() * HOROSCOPE_MESSAGES.length)] ?? ''
    
    setSelectedDay({
      date: selectedDate,
      dayName,
      horoscope: randomHoroscope
    })
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                     today.getMonth() === month && 
                     today.getFullYear() === year
      const isSelected = selectedDay && selectedDay.date.getDate() === day &&
                        selectedDay.date.getMonth() === month &&
                        selectedDay.date.getFullYear() === year
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      )
    }
    
    return days
  }

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '2rem'
      }}>
        🌟 Mystical Calendar 🌟
      </h1>
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Calendar Section */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Calendar Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <button
                onClick={goToPreviousMonth}
                style={{
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 15px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ←
              </button>
              
              <h2 style={{ 
                margin: 0, 
                color: '#2c3e50',
                fontSize: '1.5rem'
              }}>
                {MONTHS[month]} {year}
              </h2>
              
              <button
                onClick={goToNextMonth}
                style={{
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 15px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                →
              </button>
            </div>

            {/* Days of week header */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
              marginBottom: '10px'
            }}>
              {DAYS.map(day => (
                <div 
                  key={day}
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    padding: '10px',
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px'
            }}>
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Selected Day Info Section */}
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minHeight: '300px'
          }}>
            {selectedDay ? (
              <>
                <h3 style={{ 
                  color: '#2c3e50',
                  marginBottom: '20px',
                  fontSize: '1.3rem',
                  textAlign: 'center'
                }}>
                  ✨ {selectedDay.dayName} ✨
                </h3>
                
                <div style={{
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#e74c3c',
                    marginBottom: '5px'
                  }}>
                    {selectedDay.date.getDate()}
                  </div>
                  <div style={{
                    color: '#7f8c8d',
                    fontSize: '1rem'
                  }}>
                    {MONTHS[selectedDay.date.getMonth()]} {selectedDay.date.getFullYear()}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ecf0f1',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '2px solid #bdc3c7'
                }}>
                  <h4 style={{ 
                    color: '#8e44ad',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    🔮 Daily Horoscope 🔮
                  </h4>
                  <p style={{
                    lineHeight: '1.6',
                    color: '#2c3e50',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    margin: 0
                  }}>
                    "{selectedDay.horoscope}"
                  </p>
                </div>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#95a5a6',
                fontSize: '1.1rem',
                marginTop: '50px'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗓️</div>
                <p>Click on any day to reveal its mystical insights!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #e1e8ed;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .calendar-day:hover:not(.empty) {
          background: #e3f2fd;
          transform: scale(1.05);
        }
        
        .calendar-day.empty {
          background: transparent;
          border: none;
          cursor: default;
        }
        
        .calendar-day.today {
          background: #2196f3;
          color: white;
          font-weight: bold;
        }
        
        .calendar-day.selected {
          background: #e74c3c;
          color: white;
          font-weight: bold;
        }
        
        .calendar-day.today.selected {
          background: #9c27b0;
        }
      `}</style>
    </div>
  )
}

export default App