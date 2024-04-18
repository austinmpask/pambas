from datetime import datetime
from flaskr.models import (
    db,
    Domain,
    User,
    ProjectType,
    UserProject,
    SectionType,
    ProjectSection,
    LineItem,
)
from flaskr import createApp

app = createApp()

with app.app_context():

    ################################
    # Sample domain
    ################################

    domain = Domain(domain_name="Big Company")
    db.session.add(domain)
    db.session.commit()

    ################################
    # Built in project types
    ################################

    soc1type1 = ProjectType(project_type="SOC 1 Type 1")
    soc1type2 = ProjectType(project_type="SOC 1 Type 2")
    soc2type1 = ProjectType(project_type="SOC 2 Type 1")
    soc2type2 = ProjectType(project_type="SOC 2 Type 2")

    projectTypes = [soc1type1, soc1type2, soc2type1, soc2type2]

    db.session.add_all(projectTypes)
    db.session.commit()

    ################################
    # Built in section types
    ################################

    sectionType1 = SectionType(
        section_type="Control Environment", default_section_number=1
    )
    sectionType2 = SectionType(section_type="Communication", default_section_number=2)
    sectionType3 = SectionType(section_type="Risk Management", default_section_number=3)
    sectionType4 = SectionType(section_type="Monitoring", default_section_number=4)

    sectionTypes = [sectionType1, sectionType2, sectionType3, sectionType4]

    db.session.add_all(sectionTypes)
    db.session.commit()

    ################################
    # 2 Sample users
    ################################

    user1 = User(
        user_name="Big John",
        email="bigjohn@cowlife.net",
        password_hash="fsjhfdskjfhsk",
        domain_id=domain.id,
    )

    user2 = User(
        user_name="Little Joe",
        email="littlejoe@mouselife.net",
        password_hash="dfsfjkdfhshk",
        domain_id=domain.id,
    )

    users = [user1, user2]

    db.session.add_all(users)
    db.session.commit()

    ################################
    # 2 Sample user projects
    ################################

    proj1 = UserProject(
        user_project_name="Example Project Title for User 1",
        user_project_issuance=datetime.now(),
        user_project_budget=61,
        user_project_billed=11,
        project_type_id=soc1type1.id,
        user_id=user1.id,
    )
    proj2 = UserProject(
        user_project_name="Example Project Title for User 2",
        user_project_issuance=datetime.now(),
        user_project_budget=62,
        user_project_billed=22,
        project_type_id=soc2type2.id,
        user_id=user2.id,
    )
    userProjects = [proj1, proj2]

    db.session.add_all(userProjects)
    db.session.commit()

    ################################
    # 4 Sections, 2 built in, 2 custom
    ################################

    # Built in 1
    section1 = ProjectSection(
        section_type_id=sectionType1.id,
        user_project_id=proj1.id,
    )

    # Custom 1
    section2 = ProjectSection(
        custom_section_number=32,
        custom_section_type="Custom section type1, for user1's proj1",
        user_project_id=proj1.id,
    )

    # Built in 2
    section3 = ProjectSection(
        section_type_id=sectionType3.id,
        user_project_id=proj2.id,
    )

    # Custom 2
    section4 = ProjectSection(
        custom_section_number=33,
        custom_section_type="Custom section type2, for user2's proj1",
        user_project_id=proj2.id,
    )

    sections = [section1, section2, section3, section4]

    db.session.add_all(sections)
    db.session.commit()

    ################################
    # Line items
    ################################

    # Proj1 section 1
    line1 = LineItem(
        flag=True,
        item="Text for lineitem1, in section 1",
        project_section_id=section1.id,
    )
    line2 = LineItem(
        flag=False,
        item="Text for lineitem2, in section 1",
        project_section_id=section1.id,
    )
    # Proj1 section 2
    line3 = LineItem(
        flag=True,
        item="Text for lineitem3, in section 2",
        project_section_id=section2.id,
    )
    line4 = LineItem(
        flag=False,
        item="Text for lineitem4, in section 2",
        project_section_id=section2.id,
    )
    line5 = LineItem(
        flag=True,
        item="Text for lineitem5, in section 2",
        project_section_id=section2.id,
    )

    # Proj2 section 32
    line6 = LineItem(
        flag=True,
        item="Text for lineitem6, in section 32",
        project_section_id=section3.id,
    )
    line7 = LineItem(
        flag=False,
        item="Text for lineitem7, in section 32",
        project_section_id=section3.id,
    )
    line8 = LineItem(
        flag=True,
        item="Text for lineitem8, in section 32",
        project_section_id=section3.id,
    )
    line9 = LineItem(
        flag=False,
        item="Text for lineitem9, in section 32",
        project_section_id=section3.id,
    )

    # Proj2 section 33
    line10 = LineItem(
        flag=True,
        item="Text for lineitem10, in section 33",
        project_section_id=section4.id,
    )
    line11 = LineItem(
        flag=False,
        item="Text for lineitem11, in section 33",
        project_section_id=section4.id,
    )
    line12 = LineItem(
        flag=True,
        item="Text for lineitem12, in section 33",
        project_section_id=section4.id,
    )
    line13 = LineItem(
        flag=False,
        item="Text for lineitem13, in section 33",
        project_section_id=section4.id,
    )
    line14 = LineItem(
        flag=True,
        item="Text for lineitem14, in section 33",
        project_section_id=section4.id,
    )

    lines = [
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
        line7,
        line8,
        line9,
        line10,
        line11,
        line12,
        line13,
        line14,
    ]

    db.session.add_all(lines)
    db.session.commit()
