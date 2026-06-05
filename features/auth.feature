Feature: Auth API checks

  @smoke @auth
  Scenario: API health endpoint is reachable
    Given the auth API endpoint is available
    When I call the API health endpoint
    Then the response status should be 201

  @auth
  Scenario: Valid credentials return a token
    Given I have valid auth credentials
    When I request an auth token
    Then the response status should be 200
    And the response should contain a token

  @auth @negative
  Scenario: Invalid credentials return no token
    Given I have invalid auth credentials with username <username> and password <password>
    When I request an auth token
    Then the response status should be 200
    And the response should not contain a token
    And the auth failure reason should be "Bad credentials"
    Examples:
    | username | password |
    | "unknown" | "password321" |
    | "admin" | "pword1" |
    | "" | "password123" |
    | "unknown" | "" |

