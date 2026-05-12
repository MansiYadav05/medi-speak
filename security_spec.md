# Security Specification: Medi-Speak

## Data Invariants
1. A report must belong to a specific user (identified by `userId`).
2. Only the owner of a report can read, list, or delete it.
3. Reports are immutable after creation (no updates allowed).
4. Users must have a verified email to create reports.
5. Content size is strictly limited to 1MB to prevent resource exhaustion.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Unauthenticated Read**: Try to list reports without logging in.
2. **Identity Spoofing**: Create a report with a `userId` that doesn't match the current user's UID.
3. **Privilege Escalation**: Try to read another user's report.
4. **Timestamp Manipulation**: Set a backdated `createdAt` timestamp.
5. **Update Attack**: Attempt to modify an existing report's content.
6. **Massive Payload**: Attempt to save a 5MB string in the content field.
7. **Bypass Verification**: Create a report with an unverified email account.
8. **ID Poisoning**: Use a 10KB string as a report document ID.
9. **Field Injection**: Add a hidden `isAdmin` field to a report document.
10. **Delete Theft**: Attempt to delete another user's report.
11. **Malicious ID Char**: Use symbols like `$` or `*` in the report ID.
12. **Orphaned Write**: Try to create a report with a null `userId`.

## Test Results Status
- All "Dirty Dozen" payloads should return `PERMISSION_DENIED`.
