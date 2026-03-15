import pandas as pd
import random
from faker import Faker

fake = Faker()

# 1Generate dataset dynamically
skills_list = [
    "Python","Java","Data Analysis","Machine Learning",
    "Digital Marketing","UI/UX","Cybersecurity",
    "Cloud Computing","Communication","Web Development"
]

courses = [
    "Data Science",
    "Full Stack Development",
    "Digital Marketing",
    "Cybersecurity",
    "Cloud Engineering"
]

data = []

for i in range(500):
    skills = random.sample(skills_list, 3)
    data.append({
        "student_id": i+1,
        "name": fake.name(),
        "age": random.randint(18,35),
        "course": random.choice(courses),
        "skills": ",".join(skills),
        "completed": random.choice([0,1]),
        "placement_status": random.choice(["Placed","Not Placed"]),
        "salary": random.randint(15000,60000)
    })

df = pd.DataFrame(data)

# 2 Training Outcomes
total_students = len(df)
completed_students = df["completed"].sum()
completion_rate = (completed_students / total_students) * 100

print("\n--- Training Outcomes ---")
print(f"Total Students: {total_students}")
print(f"Completed Training: {completed_students}")
print(f"Completion Rate: {completion_rate:.2f}%")

# 3️ Placement Stats
placed = len(df[df["placement_status"]=="Placed"])
not_placed = len(df[df["placement_status"]=="Not Placed"])
placement_rate = (placed / total_students) * 100

print("\n--- Placement Stats ---")
print(f"Placed Students: {placed}")
print(f"Not Placed Students: {not_placed}")
print(f"Placement Rate: {placement_rate:.2f}%")

# 4️ Skill Gaps
skills = df["skills"].str.split(",").explode()
skill_counts = skills.value_counts()
lowest_skills = skill_counts.tail(5)

print("\n--- Skill Gaps ---")
print("Skills Needing Training:")
for skill, count in lowest_skills.items():
    print(f"{skill}: {count} trainees")