Feature: Booking API flow

  @smoke @booking @create
  Scenario: Create a new booking
    When I create a booking with the default booking payload
    Then the booking response status should be 200
    And the response should contain a booking id

  @booking @read
  Scenario: Retrieve an existing booking
    Given I created a booking with the default booking payload
    When I retrieve the created booking
    Then the booking response status should be 200
    And the booking first name should be "Alexander"

  @booking @update
  Scenario: Fully update an existing booking
    Given I have a valid auth token
    And I created a booking with the default booking payload
    When I update the created booking with the update booking payload
    Then the booking response status should be 200
    And the booking first name should be "Caesar"
    And the booking additional needs should be "Extra pillows"

  @booking @patch
  Scenario: Patch only booking name fields
    Given I have a valid auth token
    And I created a booking with the default booking payload
    When I patch the created booking with the patch name payload
    Then the booking response status should be 200
    And the booking first name should not be "Caesar"
    And the booking last name should be "Caesar"
    And the booking additional needs should be "Breakfast"

  @booking @delete
  Scenario: Delete an existing booking
    Given I have a valid auth token
    And I created a booking with the default booking payload
    When I delete the created booking
    Then the booking response status should be 201

  @booking @negative @delete
  Scenario: Retrieving a deleted booking returns not found
    Given I have a valid auth token
    And I created a booking with the default booking payload
    And I delete the booking
    When I retrieve the deleted booking
    Then the booking response status should be 404