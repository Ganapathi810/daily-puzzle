import { BADGE_CONFIG } from "../achievementsConfig"
import type { Achievement, BadgeId } from "../types"

type Props = {
  achievements: Achievement[]
}

export default function AchievementSection({
  achievements,
}: Props) {
  const earnedIds = achievements.map(a => a.id)

  return (
    <div className="mt-12">
      <h2 className="text-lg sm:text-xl font-bold mb-6">
        🏆 Streak Milestones
      </h2>

      <div>
        {earnedIds.length === 0 ? (
          <div className="flex items-center justify-center h-20 sm:h-32 max-w-xl bg-[#03162c] rounded">
            <p className="text-neutral-400">No badges earned yet</p>
          </div>


          //to check how badges render
          // <div className="flex gap-6 flex-wrap bg-[#03162c] p-4 rounded-lg xl:max-w-xl">
          //   {["streak_7","streak_30","streak_100","streak_365"].map(badgeId => {
          //     const imagePath = BADGE_CONFIG[badgeId as BadgeId].imagePath
          //     const badgeTitle =  BADGE_CONFIG[badgeId as BadgeId].title
            
          //     return (
          //       <div
          //         style={{ borderRadius: '35px'}}
          //         className="flex items-center justify-center transition-all "
          //       >
          //           <img
          //               key={badgeId}
          //               src={imagePath}
          //               alt={badgeTitle}
          //               className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl"
          //           />
          //       </div>
          //     )
          //   })}
          // </div>
        ) : ( 
          <div className="flex gap-6 flex-wrap bg-[#03162c] p-4 rounded-lg xl:max-w-xl">
            {earnedIds.map(badgeId => {
              const imagePath = BADGE_CONFIG[badgeId as BadgeId].imagePath
              const badgeTitle =  BADGE_CONFIG[badgeId as BadgeId].title
            
              return (
                <div
                  style={{ borderRadius: '35px'}}
                  className="flex items-center justify-center transition-all"
                >
                    <img
                        key={badgeId}
                        src={imagePath}
                        alt={badgeTitle}
                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl"
                    />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
