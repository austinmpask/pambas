# Make sure there are no issues with the sections in request
def validateSections(sections):

    # Fail if sections is None
    if not sections:
        return (400, "Sections missing")

    # Abort if empty section or control #
    for section in sections:
        if not section["section"] or not section["controls"]:
            return (400, "Section or control # is empty")

    # Abort if duplicate section numbers present
    keys = [item["section"] for item in sections]
    uniques = set(keys)
    if len(uniques) != len(keys):
        return (400, "Duplicate section number submitted")

    return (200, "Valid")
